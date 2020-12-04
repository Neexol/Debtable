package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.requests.CreateRoomRequest
import ru.neexol.debtable.models.responses.CompactRoomResponse
import ru.neexol.debtable.models.responses.RoomResponse
import ru.neexol.debtable.models.responses.RoomsResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.routes.API
import ru.neexol.debtable.utils.*

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
    post<ApiRoomsRoute, CreateRoomRequest>(
        "Create room"
            .examples(
                example("Create room example", CreateRoomRequest.example)
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
                        getUserFromToken()
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
        "Get user's rooms"
            .responds(
                ok<RoomsResponse>(
                    example("Rooms list", RoomsResponse.example)
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
                val compactRoomList = result.map { CompactRoomResponse(it) }
                call.respond(RoomsResponse(compactRoomList))
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

}