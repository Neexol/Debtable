package ru.neexol.debtable.db.tables

import db.tables.Purchases
import db.tables.Users
import org.jetbrains.exposed.sql.Table

object DebtorsPurchases : Table() {
    val debtor = reference("debtor", Users)
    val purchase = reference("purchase", Purchases)
    override val primaryKey = PrimaryKey(debtor, purchase)
}