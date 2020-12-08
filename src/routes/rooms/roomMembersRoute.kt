package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.utils.exceptions.access.RoomAccessException
import ru.neexol.debtable.utils.exceptions.not_found.MemberNotFoundException
import ru.neexol.debtable.utils.exceptions.not_found.RoomNotFoundException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.forbidden
import ru.neexol.debtable.utils.getUserIdFromToken
import ru.neexol.debtable.utils.unauthorized

const val API_ROOM_MEMBERS = "$API_ROOM/members"
const val API_ROOM_MEMBER = "$API_ROOM_MEMBERS/{member_id}"

@Group("Members")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_MEMBERS) data class ApiRoomMembersRoute(val room_id: Int)
@Group("Members")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_MEMBER) data class ApiRoomMemberRoute(val room_id: Int, val member_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomMembersRoute() {
    memberEndpoint()
}
@KtorExperimentalLocationsAPI
private fun Route.memberEndpoint() {
    get<ApiRoomMembersRoute>(
        "Get room members"
            .responds(
                ok<List<UserResponse>>(
                    example("Members example", UserResponse.EXAMPLES, description = "Success.")
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
                    RoomsRepository.getRoomMembers(room.id.value)!!
                }
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

    delete<ApiRoomMemberRoute>(
        "Delete room member"
            .responds(
                ok<Int>(
                    example("Deleted room member id", 5, description = "Success.")
                ),
                unauthorized(),
                notFound(description = "Room or member not found."),
                forbidden(description = "Access to room denied."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.deleteMemberFromRoom(route.room_id, route.member_id) ?: throw MemberNotFoundException()
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
                    is MemberNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Member not found."
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