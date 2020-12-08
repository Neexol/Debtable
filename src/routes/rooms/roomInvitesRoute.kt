package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.requests.AcceptInviteRequest
import ru.neexol.debtable.models.requests.CreateInviteRequest
import ru.neexol.debtable.models.responses.RoomResponse
import ru.neexol.debtable.models.responses.InvitedUsersResponse
import ru.neexol.debtable.models.responses.RoomsResponse
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.*
import ru.neexol.debtable.utils.exceptions.*

const val API_ROOM_INVITES = "$API_ROOM/invites"
const val API_ROOMS_INVITES = "$API_ROOMS/invites"
const val API_ROOMS_INVITE = "$API_ROOMS_INVITES/{invite_id}"

@Group("Invites")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_INVITES) data class ApiRoomInvitesRoute(val room_id: Int)
@Group("Invites")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_INVITES) data class ApiRoomInvitesWithUserIdRoute(val room_id: Int, val user_id: Int)
@Group("Invites")
@KtorExperimentalLocationsAPI
@Location(API_ROOMS_INVITES) class ApiRoomsInvitesRoute
@Group("Invites")
@KtorExperimentalLocationsAPI
@Location(API_ROOMS_INVITE) data class ApiRoomsInviteRoute(val invite_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomInvitesRoute() {
    roomInvitesEndpoint()
    roomsInvitesEndpoint()
    roomsInviteEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.roomInvitesEndpoint() {
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
                conflict(description = "User already in room or already invited.")
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.isRoomContainsUser(route.room_id, request.userId).ifTrue {
                    throw UserAlreadyInRoomException()
                }
                RoomsRepository.inviteUserToRoom(
                    route.room_id,
                    UsersRepository.getUserById(request.userId) ?: throw NotFoundException()
                ) ?: throw UserAlreadyInvitedException()
            },
            onSuccess = { result ->
                call.respond(UserResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "User or room not found."
                        )
                        is ForbiddenException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access denied."
                        )
                        is UserAlreadyInvitedException -> call.respond(
                            HttpStatusCode.Conflict,
                            "User already invited."
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

    delete<ApiRoomInvitesWithUserIdRoute>(
        "Delete invite to this room"
            .responds(
                ok<Int>(
                    example("Deleted user id example", 3)
                ),
                unauthorized(),
                notFound(description = "Invite or room not found."),
                forbidden(),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.deleteInvite(route.room_id, route.user_id) ?: throw NotFoundException()
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Invite or room not found."
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

@KtorExperimentalLocationsAPI
private fun Route.roomsInvitesEndpoint() {
    get<ApiRoomsInvitesRoute> (
        "Get user's invites"
            .responds(
                ok<RoomsResponse>(
                    example("Invites example", RoomsResponse.example)
                ),
                unauthorized(),
                badRequest(description = "Other errors.")
            )
    ) {
        foldRunCatching(
            block = {
                UsersRepository.getUserInvites(getUserIdFromToken())!!
            },
            onSuccess = { result ->
                call.respond(RoomsResponse(result.map { RoomResponse(it) }))
            },
            onFailure = { exception ->
                call.respond(
                    HttpStatusCode.BadRequest,
                    exception.toString()
                )
            }
        )
    }

    post<ApiRoomsInvitesRoute, AcceptInviteRequest>(
        "Accept an invite"
            .examples(
                example("Accept invite example", AcceptInviteRequest.example)
            )
            .responds(
                ok<Int>(
                    example("Accepted invite id", 3)
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "Invite not found.")
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                RoomsRepository.acceptInvite(
                    request.inviteId,
                    UsersRepository.getUserById(getUserIdFromToken())!!
                ) ?: throw NotFoundException()
            },
            onSuccess = { result ->
                call.respond(RoomResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Invite not found."
                        )
                        else -> call.respond(
                            HttpStatusCode.BadRequest,
                            exception.toString()
                        )
                    }
                }
            }
        )
    }
}

@KtorExperimentalLocationsAPI
private fun Route.roomsInviteEndpoint() {
    delete<ApiRoomsInviteRoute>(
        "Decline an invite"
            .responds(
                ok<Int>(
                    example("Declined invite id", 3)
                ),
                unauthorized(),
                notFound(description = "Invite not found."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.getRoomById(route.invite_id)!!
                UsersRepository.declineInvite(
                    getUserIdFromToken(),
                    route.invite_id
                ) ?: throw NotFoundException()
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Invite not found."
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