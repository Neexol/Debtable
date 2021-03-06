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
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.*
import ru.neexol.debtable.utils.exceptions.access.RoomAccessException
import ru.neexol.debtable.utils.exceptions.conflict.UserAlreadyInRoomException
import ru.neexol.debtable.utils.exceptions.conflict.UserAlreadyInvitedException
import ru.neexol.debtable.utils.exceptions.not_found.InviteNotFoundException
import ru.neexol.debtable.utils.exceptions.not_found.RoomNotFoundException
import ru.neexol.debtable.utils.exceptions.not_found.UserNotFoundException

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
    get<ApiRoomInvitesRoute>(
        "Get users invited to this room"
            .responds(
                ok<List<UserResponse>>(
                    example("Invited users example", UserResponse.EXAMPLES, description = "Success.")
                ),
                unauthorized(),
                notFound(description = "Room not found."),
                forbidden(description = "Access to room denied."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.getInvitedUsersToRoom(route.room_id)!!
            },
            onSuccess = { result ->
                call.respond(result.map { UserResponse(it) })
            },
            onFailure = { exception ->
                when (exception) {
                    is RoomNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Room not found."
                    )
                    is RoomAccessException -> call.respond(
                        HttpStatusCode.Forbidden,
                        "Access to room denied."
                    )
                    else -> call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }

    post<ApiRoomInvitesRoute, CreateInviteRequest>(
        "Invite user to room"
            .examples(
                example("Create invite example", CreateInviteRequest.EXAMPLE)
            )
            .responds(
                ok<UserResponse>(
                    example("Invited user example", UserResponse.EXAMPLES[1], description = "Success.")
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "User or room not found."),
                forbidden(description = "Access to room denied."),
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
                    UsersRepository.getUserById(request.userId) ?: throw UserNotFoundException()
                ) ?: throw UserAlreadyInvitedException()
            },
            onSuccess = { result ->
                call.respond(UserResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is RoomNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Room not found."
                        )
                        is UserNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "User not found."
                        )
                        is RoomAccessException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to room denied."
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

    delete<ApiRoomInvitesWithUserIdRoute>(
        "Delete invite to this room"
            .responds(
                ok<Int>(
                    example("Deleted user id example", 3, description = "Success.")
                ),
                unauthorized(),
                notFound(description = "Invite or room not found."),
                forbidden(description = "Access to room denied."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.deleteInvite(route.room_id, route.user_id) ?: throw InviteNotFoundException()
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is RoomNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Room not found."
                    )
                    is InviteNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Invite not found."
                    )
                    is RoomAccessException -> call.respond(
                        HttpStatusCode.Forbidden,
                        "Access to room denied."
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
        "Get user invites"
            .responds(
                ok<List<RoomResponse>>(
                    example("Invites example", RoomResponse.EXAMPLES, description = "Success.")
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
                call.respond(result.map { RoomResponse(it) })
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
                example("Accept invite example", AcceptInviteRequest.EXAMPLE)
            )
            .responds(
                ok<RoomResponse>(
                    example("Room example", RoomResponse.EXAMPLES[0], description = "Success.")
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
                ) ?: throw InviteNotFoundException()
            },
            onSuccess = { result ->
                call.respond(RoomResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is InviteNotFoundException -> call.respond(
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
                    example("Declined invite id", 3, description = "Success.")
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
                ) ?: throw InviteNotFoundException()
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is InviteNotFoundException -> call.respond(
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