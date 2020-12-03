package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.locations.*
import io.ktor.routing.*

const val API_ROOM_MEMBERS = "$API_ROOM/members"
const val API_ROOM_MEMBER = "$API_ROOM_MEMBERS/{member_id}"

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_MEMBER) data class ApiRoomMemberRoute(val room_id: Int, val member_id: Int)

fun Route.roomMembersRoute() {
    memberEndpoint()
}

private fun Route.memberEndpoint() {

}