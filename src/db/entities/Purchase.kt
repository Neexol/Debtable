package ru.neexol.debtable.db.entities

import db.tables.Purchases
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.neexol.debtable.db.tables.DebtorsPurchases

class Purchase(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<Purchase>(Purchases)

    var name by Purchases.name
    var debt by Purchases.debt
    var date by Purchases.date
    var buyer by User referencedOn Purchases.buyer
    var debtors by User via DebtorsPurchases
}