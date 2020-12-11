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
import ru.neexol.debtable.utils.exceptions.access.RoomAccessException
import ru.neexol.debtable.utils.exceptions.access.UserAccessException
import ru.neexol.debtable.utils.exceptions.bad_request.EmptyDebtorsException
import ru.neexol.debtable.utils.exceptions.not_found.PurchaseNotFoundException
import ru.neexol.debtable.utils.exceptions.not_found.RoomNotFoundException
import java.text.SimpleDateFormat

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
    get<ApiRoomPurchasesRoute>(
        "Get room purchases"
            .responds(
                ok<List<PurchaseResponse>>(
                    example("Purchases example", PurchaseResponse.EXAMPLES, description = "Success.")
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
                    PurchasesRepository.getPurchases(room)
                }
            },
            onSuccess = { result ->
                val purchases = result.map {
                    PurchaseResponse(it)
                }.sortedWith(compareBy(
                    { SimpleDateFormat("dd.MM.yyyy").parse(it.date) },
                    { -it.id }
                ))
                call.respond(purchases)
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

    post<ApiRoomPurchasesRoute, CreateEditPurchaseRequest>(
        "Create purchase"
            .examples(
                example("Create purchase example", CreateEditPurchaseRequest.EXAMPLE)
            )
            .responds(
                ok<PurchaseResponse>(
                    example("Purchase example", PurchaseResponse.EXAMPLES[1], description = "Success.")
                ),
                *jsonBodyErrors,
                unauthorized(),
                notFound(description = "Room not found."),
                forbidden(description = "Access to room or user denied.")
            )
    ) { route, request ->
        foldRunCatching(
            block = {
                request.debtorIds.ifEmpty { throw EmptyDebtorsException() }
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let { room ->
                    (request.debtorIds + request.buyerId).forEach {
                        RoomsRepository.isRoomContainsUser(room.id.value, it).ifFalse {
                            throw UserAccessException()
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
                        is RoomNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Room not found."
                        )
                        is UserAccessException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to user denied."
                        )
                        is RoomAccessException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to room denied."
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
                example("Edit purchase example", CreateEditPurchaseRequest.EXAMPLE)
            )
            .responds(
                ok<PurchaseResponse>(
                    example("Purchase example", PurchaseResponse.EXAMPLES[0], description = "Success.")
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
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let { room ->
                    (request.debtorIds + request.buyerId).forEach {
                        RoomsRepository.isRoomContainsUser(route.room_id, it).ifFalse {
                            throw UserAccessException()
                        }
                    }

                    PurchasesRepository.editPurchase(
                        room,
                        route.purchase_id,
                        UsersRepository.getUserById(request.buyerId)!!,
                        request.debtorIds.map { UsersRepository.getUserById(it)!! },
                        request.name,
                        request.debt / request.debtorIds.size,
                        request.date,
                    ) ?: throw PurchaseNotFoundException()
                }
            },
            onSuccess = { result ->
                call.respond(PurchaseResponse(result))
            },
            onFailure =  { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is RoomNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Room not found."
                        )
                        is PurchaseNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "Purchase not found."
                        )
                        is UserAccessException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to user denied."
                        )
                        is RoomAccessException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Access to room denied."
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
                    example("Deleted purchase id example", 3, description = "Success.")
                ),
                unauthorized(),
                notFound(description = "Purchase or room not found."),
                forbidden(description = "Access to room denied."),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                RoomsRepository.checkRoomAccess(route.room_id, getUserIdFromToken()).let {
                    PurchasesRepository.deletePurchase(it, route.purchase_id) ?: throw PurchaseNotFoundException()
                }
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
                    is PurchaseNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "Purchase not found."
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