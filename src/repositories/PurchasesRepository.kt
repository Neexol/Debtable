package ru.neexol.debtable.repositories

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.Purchase
import ru.neexol.debtable.db.entities.Room
import ru.neexol.debtable.db.entities.User
import ru.neexol.debtable.models.responses.PurchaseResponse
import ru.neexol.debtable.utils.StatsString

object PurchasesRepository {
    suspend fun addPurchase(
        room: Room,
        buyer: User,
        debtors: List<User>,
        name: String,
        debt: Float,
        date: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        Purchase.new {
            this.room = room
            this.buyer = buyer
            this.name = name
            this.debt = debt
            this.date = date
        }
    }.also { purchase ->
        newSuspendedTransaction(Dispatchers.IO) {
            purchase.debtors = SizedCollection(debtors)
            room.stats = StatsString(room.stats).apply {
                addPurchase(PurchaseResponse(purchase))
            }.toString()
        }
    }

    suspend fun editPurchase(
        room: Room,
        purchaseId: Int,
        buyer: User,
        debtors: List<User>,
        name: String,
        debt: Float,
        date: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        Purchase.findById(purchaseId)?.also { purchase ->
            val oldPurchaseResponse = PurchaseResponse(purchase)
            purchase.buyer = buyer
            purchase.name = name
            purchase.debt = debt
            purchase.date = date
            purchase.debtors = SizedCollection(debtors)
            val newPurchaseResponse = PurchaseResponse(purchase)
            room.stats = StatsString(room.stats).apply {
                editPurchase(oldPurchaseResponse, newPurchaseResponse)
            }.toString()
        }
    }

    suspend fun deletePurchase(
        room: Room,
        purchaseId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        room.purchases.find {
            it.id.value == purchaseId
        }?.also { purchase ->
            room.stats = StatsString(room.stats).apply {
                removePurchase(PurchaseResponse(purchase))
            }.toString()
            purchase.delete()
        }?.id?.value
    }
}