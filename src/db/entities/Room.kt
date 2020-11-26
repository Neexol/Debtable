package ru.neexol.debtable.db.entities

import db.tables.Rooms
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.neexol.debtable.db.tables.UsersRooms

class Room(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<Room>(Rooms)

    var name by Rooms.name
    var users by User via UsersRooms
}