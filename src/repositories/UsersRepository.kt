package ru.neexol.debtable.repositories

import db.tables.Users
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.User

object UsersRepository {
    suspend fun addUser(
        username: String,
        displayName: String,
        passwordHash: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.new {
            this.username = username
            this.displayName = displayName
            this.passwordHash = passwordHash
        }
    }

    suspend fun findUserById(
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.findById(userId)
    }

    suspend fun findUserByUserName(
        username: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.find {
            Users.username eq username
        }.singleOrNull()
    }
}