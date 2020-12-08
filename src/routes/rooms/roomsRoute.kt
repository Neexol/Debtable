package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.requests.CreateEditRoomRequest
import ru.neexol.debtable.models.responses.RoomResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.routes.API
import ru.neexol.debtable.utils.*
import ru.neexol.debtable.utils.exceptions.ForbiddenException
import ru.neexol.debtable.utils.exceptions.NotFoundException

const val API_ROOMS = "$API/rooms"
const val API_ROOM = "$API_ROOMS/{room_id}"

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOMS) class ApiRoomsRoute

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOM) data class ApiRoomRoute(val room_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomsRoute() {
    roomMembersRoute()
    roomInvitesRoute()
    roomPurchasesRoute()
    roomsEndpoint()
    roomEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.roomsEndpoint() {
    post<ApiRoomsRoute, CreateEditRoomRequest>(
        "Create room"
            .examples(
                example("Create room example", CreateEditRoomRequest.example)
            )
            .responds(
                ok<RoomResponse>(
                    example("Created room example", RoomResponse.example)
                ),
                *jsonBodyErrors,
                unauthorized()
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                RoomsRepository.addRoom(request.name).apply {
                    RoomsRepository.addUserToRoom(
                        this.id.value,
                        UsersRepository.getUserById(getUserIdFromToken())!!
                    )
                }
            },
            onSuccess = { result ->
                call.respond(RoomResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }

    get<ApiRoomsRoute>(
        "Get user rooms"
            .responds(
                ok<List<RoomResponse>>(
                    example("Rooms list", listOf(RoomResponse.example, RoomResponse.example, RoomResponse.example))
                ),
                unauthorized(),
                badRequest(description = "Other errors.")
            )
    ) {
        foldRunCatching(
            block = {
                UsersRepository.getUserRooms(getUserIdFromToken())!!
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
}

@KtorExperimentalLocationsAPI
private fun Route.roomEndpoint() {
    put<ApiRoomRoute, CreateEditRoomRequest>(
        "Edit room"
            .examples(
                example("Edit room example", CreateEditRoomRequest.example)
            )
            .responds(
                ok<RoomResponse>(
                    example("Room example", RoomResponse.example)
                ),
                *jsonBodyErrors,
                notFound(description = "Room not found."),
                forbidden()
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.editRoom(route.room_id, request.name)!!
            },
            onSuccess = { result ->
                call.respond(RoomResponse(result))
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
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
            }
        )
    }

    delete<ApiRoomRoute>(
        "Delete room"
            .responds(
                ok<Int>(
                    example("Deleted room id", 5)
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
                RoomsRepository.deleteRoom(route.room_id)!!
            },
            onSuccess = { result ->
                call.respond(result)
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