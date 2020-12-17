package ru.neexol.debtable.db.entities

import db.tables.Users
import io.ktor.auth.*
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.neexol.debtable.db.tables.Invites
import ru.neexol.debtable.db.tables.Members

class User(id: EntityID<Int>): IntEntity(id), Principal {
    companion object : IntEntityClass<User>(Users)

    var username by Users.username
    var displayName by Users.displayName
    var passwordHash by Users.passwordHash
    var rooms by Room via Members
    var invites by Room via Invites
}