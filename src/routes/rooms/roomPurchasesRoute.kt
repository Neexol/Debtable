package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.locations.*
import io.ktor.routing.*

const val API_ROOM_PURCHASES = "$API_ROOM/purchases"
const val API_ROOM_PURCHASE = "$API_ROOM_PURCHASES/{purchase_id}"

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_PURCHASES) data class ApiRoomPurchasesRoute(val room_id: Int)

@Group("Rooms")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_PURCHASE) data class ApiRoomPurchaseRoute(val room_id: Int, val purchase_id: Int)

fun Route.roomPurchasesRoute() {
    purchasesEndpoint()
    purchaseEndpoint()
}

private fun Route.purchasesEndpoint() {

}

private fun Route.purchaseEndpoint() {

}