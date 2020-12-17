package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.responses.UserBalanceResponse
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.access.RoomAccessException
import ru.neexol.debtable.utils.exceptions.not_found.RoomNotFoundException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.forbidden
import ru.neexol.debtable.utils.getUserIdFromToken
import ru.neexol.debtable.utils.unauthorized

const val API_ROOM_STATS = "$API_ROOM/stats"

@Group("Stats")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_STATS) data class ApiRoomStatsRoute(val room_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomStatsRoute() {
    statsEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.statsEndpoint() {
    get<ApiRoomStatsRoute>(
        "Get room stats"
            .responds(
                ok<List<UserBalanceResponse>>(
                    example("User balances example", UserBalanceResponse.EXAMPLES)
                ),
                unauthorized(),
                notFound(description = "Room not found."),
                forbidden(description = "Access to room denied."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let { room ->
                    RoomsRepository.getRoomStats(room.id.value)!!.map { (userId, balance) ->
                        Pair(UserResponse(UsersRepository.getUserById(userId)!!), balance)
                    }
                }
            },
            onSuccess = { result ->
                call.respond(result.map { (user, balance) -> UserBalanceResponse(user, balance) })
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