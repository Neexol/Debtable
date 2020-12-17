package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption

object Purchases : IntIdTable() {
    val name = text("name")
    val debt = float("debt")
    val date = text("date")
    val buyer = reference("buyer", Users)
    val room = reference("room", Rooms, onDelete = ReferenceOption.CASCADE)
}