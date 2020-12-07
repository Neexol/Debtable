package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.requests.CreateInviteRequest
import ru.neexol.debtable.models.responses.InvitedUsersResponse
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.*
import ru.neexol.debtable.utils.exceptions.ForbiddenException
import ru.neexol.debtable.utils.exceptions.NotFoundException
import ru.neexol.debtable.utils.exceptions.UserAlreadyInRoomException

const val API_ROOM_INVITES = "$API_ROOM/invites"

@Group("Invites")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_INVITES) data class ApiRoomInvitesRoute(val room_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomInvitesRoute() {
    invitesEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.invitesEndpoint() {
    post<ApiRoomInvitesRoute, CreateInviteRequest>(
        "Invite user to room"
            .examples(
                example("Create invite example", CreateInviteRequest.example)
            )
            .responds(
                ok<UserResponse>(
                    example("Invited user example", UserResponse.example)
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "User or room not found."),
                forbidden(),
                conflict(description = "User already in room."),
                badRequest(description = "Other errors.")
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                val userForInvite = UsersRepository.getUserById(request.userId) ?: throw NotFoundException()
                RoomsRepository.inviteUserToRoom(route.room_id, userForInvite) ?: throw UserAlreadyInRoomException()
            },
            onSuccess = { result ->
                call.respond(UserResponse(result))
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "User or room not found."
                    )
                    is ForbiddenException -> call.respond(
                        HttpStatusCode.Forbidden,
                        "Access denied."
                    )
                    is UserAlreadyInRoomException -> call.respond(
                        HttpStatusCode.Conflict,
                        "User already in room."
                    )
                    else -> call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }

    get<ApiRoomInvitesRoute>(
        "Get users invited to this room"
            .responds(
                ok<InvitedUsersResponse>(
                    example("Invited users example", InvitedUsersResponse.example)
                ),
                unauthorized(),
                notFound(description = "Room not found."),
                forbidden(),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.getInvitedUsersToRoom(route.room_id)!!
            },
            onSuccess = { result ->
                val userResponsesList = result.map { UserResponse(it) }
                call.respond(InvitedUsersResponse(userResponsesList))
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Room not found."
                    )
                    is ForbiddenException -> call.respond(
                        HttpStatusCode.Forbidden,
                        "Access denied."
                    )
                    else -> call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }
}