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
import ru.neexol.debtable.utils.exceptions.access.RoomAccessException
import ru.neexol.debtable.utils.exceptions.not_found.RoomNotFoundException

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
    roomStatsRoute()
    roomsEndpoint()
    roomEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.roomsEndpoint() {
    get<ApiRoomsRoute>(
        "Get user rooms"
            .responds(
                ok<List<RoomResponse>>(
                    example("Rooms list", RoomResponse.EXAMPLES, description = "Success.")
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
    
    post<ApiRoomsRoute, CreateEditRoomRequest>(
        "Create room"
            .examples(
                example("Create room example", CreateEditRoomRequest.EXAMPLE)
            )
            .responds(
                ok<RoomResponse>(
                    example("Created room example", RoomResponse.EXAMPLES[2], description = "Success.")
                ),
                *jsonBodyErrors,
                unauthorized()
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                RoomsRepository.addRoom(request.name, UsersRepository.getUserById(getUserIdFromToken())!!)
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
}

@KtorExperimentalLocationsAPI
private fun Route.roomEndpoint() {
    get<ApiRoomRoute>(
        "Get room by id"
            .responds(
                ok<RoomResponse>(
                    example("Room example", RoomResponse.EXAMPLES[0])
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
            },
            onSuccess = { result ->
                call.respond(RoomResponse(result))
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

    put<ApiRoomRoute, CreateEditRoomRequest>(
        "Edit room"
            .examples(
                example("Edit room example", CreateEditRoomRequest.EXAMPLE)
            )
            .responds(
                ok<RoomResponse>(
                    example("Room example", RoomResponse.EXAMPLES[1], description = "Success.")
                ),
                *jsonBodyErrors,
                notFound(description = "Room not found."),
                forbidden(description = "Access to room denied.")
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
            }
        )
    }

    delete<ApiRoomRoute>(
        "Delete room"
            .responds(
                ok<Int>(
                    example("Deleted room id", 5, description = "Success.")
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
                RoomsRepository.deleteRoom(route.room_id)!!
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