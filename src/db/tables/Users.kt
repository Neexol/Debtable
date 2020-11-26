package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable() {
    val username = varchar("username", 128).uniqueIndex()
    val displayName = varchar("display_name", 128)
    val passwordHash = varchar("password_hash", 64)
}