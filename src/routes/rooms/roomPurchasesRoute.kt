package ru.neexol.debtable.routes.rooms

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.requests.CreateEditPurchaseRequest
import ru.neexol.debtable.models.responses.PurchaseResponse
import ru.neexol.debtable.repositories.PurchasesRepository
import ru.neexol.debtable.repositories.RoomsRepository
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.*
import ru.neexol.debtable.utils.exceptions.*

const val API_ROOM_PURCHASES = "$API_ROOM/purchases"
const val API_ROOM_PURCHASE = "$API_ROOM_PURCHASES/{purchase_id}"

@Group("Purchases")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_PURCHASES) data class ApiRoomPurchasesRoute(val room_id: Int)

@Group("Purchases")
@KtorExperimentalLocationsAPI
@Location(API_ROOM_PURCHASE) data class ApiRoomPurchaseRoute(val room_id: Int, val purchase_id: Int)

@KtorExperimentalLocationsAPI
fun Route.roomPurchasesRoute() {
    purchasesEndpoint()
    purchaseEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.purchasesEndpoint() {
    post<ApiRoomPurchasesRoute, CreateEditPurchaseRequest>(
        "Create purchase"
            .examples(
                example("Create purchase example", CreateEditPurchaseRequest.example)
            )
            .responds(
                ok<PurchaseResponse>(
                    example("Purchase example", PurchaseResponse.example)
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "Users or room not found."),
                forbidden(description = "Access to room or user denied.")
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                request.debtorIds.ifEmpty { throw EmptyDebtorsException() }
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let { room ->
                    (request.debtorIds + request.buyerId).forEach {
                        RoomsRepository.isRoomContainsUser(room.id.value, it).ifFalse {
                            throw ForbiddenException()
                        }
                    }

                    PurchasesRepository.addPurchase(
                        room,
                        UsersRepository.getUserById(request.buyerId)!!,
                        request.debtorIds.map { UsersRepository.getUserById(it)!! },
                        request.name,
                        request.debt / request.debtorIds.size,
                        request.date,
                    )
                }
            },
            onSuccess = { result ->
                call.respond(PurchaseResponse(result))
            },
            onFailure =  { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Users or room not found."
                        )
                        is ForbiddenException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to room or user denied."
                        )
                        is EmptyDebtorsException -> call.respond(
                            HttpStatusCode.BadRequest,
                            "Empty debtors list."
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
private fun Route.purchaseEndpoint() {
    put<ApiRoomPurchaseRoute, CreateEditPurchaseRequest>(
        "Edit purchase"
            .examples(
                example("Edit purchase example", CreateEditPurchaseRequest.example)
            )
            .responds(
                ok<PurchaseResponse>(
                    example("Purchase example", PurchaseResponse.example)
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "Purchase or users or room not found."),
                forbidden(description = "Access to room or user denied.")
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                request.debtorIds.ifEmpty { throw EmptyDebtorsException() }
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken())
                (request.debtorIds + request.buyerId).forEach {
                    RoomsRepository.isRoomContainsUser(route.room_id, it).ifFalse {
                        throw ForbiddenException()
                    }
                }

                PurchasesRepository.editPurchase(
                    route.purchase_id,
                    UsersRepository.getUserById(request.buyerId)!!,
                    request.debtorIds.map { UsersRepository.getUserById(it)!! },
                    request.name,
                    request.debt / request.debtorIds.size,
                    request.date,
                ) ?: throw NotFoundException()
            },
            onSuccess = { result ->
                call.respond(PurchaseResponse(result))
            },
            onFailure =  { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Purchase or users or room not found."
                        )
                        is ForbiddenException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to room or user denied."
                        )
                        is EmptyDebtorsException -> call.respond(
                            HttpStatusCode.BadRequest,
                            "Empty debtors list."
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

    delete<ApiRoomPurchaseRoute>(
        "Delete purchase"
            .responds(
                ok<Int>(
                    example("Deleted purchase id example", 3)
                ),
                unauthorized(),
                notFound(description = "Purchase or room not found."),
                forbidden(),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let {
                    PurchasesRepository.deletePurchase(it, route.purchase_id) ?: throw NotFoundException()
                }
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                when (exception) {
                    is NotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Purchase or room not found."
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