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
import ru.neexol.debtable.utils.exceptions.ForbiddenException
import ru.neexol.debtable.utils.exceptions.NotFoundException
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
                    example("Members example", listOf(UserResponse.example, UserResponse.example, UserResponse.example))
                ),
                unauthorized(),
                notFound(description = "Room not found."),
                forbidden(),
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

    delete<ApiRoomMemberRoute>(
        "Delete room member"
            .responds(
                ok<Int>(
                    example("Deleted room member id", 5)
                ),
                unauthorized(),
                notFound(description = "Room or member not found."),
                forbidden(),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                RoomsRepository.deleteMemberFromRoom(route.room_id, route.member_id) ?: throw NotFoundException()
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Room or member not found."
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