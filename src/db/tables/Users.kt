package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable() {
    val userName = varchar("user_name", 128).uniqueIndex()
    val displayName = varchar("display_name", 128)
    val passwordHash = varchar("password_hash", 64)
}