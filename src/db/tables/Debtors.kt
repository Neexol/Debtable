package ru.neexol.debtable.db.tables

import db.tables.Purchases
import db.tables.Users
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

object Debtors : Table() {
    val debtor = reference("debtor", Users)
    val purchase = reference("purchase", Purchases, onDelete = ReferenceOption.CASCADE)
    override val primaryKey = PrimaryKey(debtor, purchase)
}