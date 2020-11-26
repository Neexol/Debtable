package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Rooms : IntIdTable() {
    val name = varchar("name", 128)
}