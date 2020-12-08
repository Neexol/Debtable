package ru.neexol.debtable.repositories

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.Purchase
import ru.neexol.debtable.db.entities.Room
import ru.neexol.debtable.db.entities.User

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
        }
    }
}