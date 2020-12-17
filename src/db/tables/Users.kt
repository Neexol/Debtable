package db.tables

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable() {
    val username = text("username").uniqueIndex()
    val displayName = text("display_name")
    val passwordHash = text("password_hash")
}