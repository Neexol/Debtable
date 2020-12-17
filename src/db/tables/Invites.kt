package ru.neexol.debtable.db.tables

import db.tables.Rooms
import db.tables.Users
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

object Invites : Table() {
    val user = reference("user", Users)
    val room = reference("room", Rooms, onDelete = ReferenceOption.CASCADE)
    override val primaryKey = PrimaryKey(user, room)
}