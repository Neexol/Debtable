package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.locations.*
import io.ktor.routing.*

const val API_ROOM_INVITES = "$API_ROOM/invites"

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_INVITES) data class ApiRoomsInvitesRoute(val room_id: Int)

fun Route.roomInvitesRoute() {
    invitesEndpoint()
}

private fun Route.invitesEndpoint() {

}