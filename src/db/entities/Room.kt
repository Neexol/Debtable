package ru.neexol.debtable.db.entities

import db.tables.Purchases
import db.tables.Rooms
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.neexol.debtable.db.tables.Invites
import ru.neexol.debtable.db.tables.Members

class Room(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<Room>(Rooms)

    var name by Rooms.name
    var stats by Rooms.stats
    val purchases by Purchase referrersOn Purchases.room
    var members by User via Members
    var invitedUsers by User via Invites
}