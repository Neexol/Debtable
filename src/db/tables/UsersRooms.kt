package ru.neexol.debtable.db.tables

import db.tables.Rooms
import db.tables.Users
import org.jetbrains.exposed.sql.Table

object UsersRooms : Table() {
    val user = reference("user", Users)
    val room = reference("room", Rooms)
    override val primaryKey = PrimaryKey(user, room)
}