package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Rooms : IntIdTable() {
    val name = text("name")
    val stats = text("stats").default("")
}