package ru.neexol.debtable.db.entities

import db.tables.Users
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.neexol.debtable.db.tables.UsersRooms

class User(id: EntityID<Int>): IntEntity(id) {
    companion object : IntEntityClass<User>(Users)

    var userName by Users.userName
    var displayName by Users.displayName
    var passwordHash by Users.passwordHash
    var rooms by Room via UsersRooms
}