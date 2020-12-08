package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Purchases : IntIdTable() {
    val name = varchar("name", 128)
    val debt = float("debt")
    val date = varchar("date", 64)
    val buyer = reference("buyer", Users)
    val room = reference("room", Rooms)
}