package ru.neexol.debtable.repositories

import db.tables.Users
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.User
import ru.neexol.debtable.utils.ilike

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

    suspend fun getUserById(
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.findById(userId)
    }

    suspend fun getUserByUserName(
        username: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.find {
            Users.username ilike username
        }.singleOrNull()
    }

    suspend fun getUsersByUserName(
        username: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        User.find {
            Users.username ilike "%$username%"
        }.toList()
    }

    suspend fun getUserRooms(
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getUserById(userId)?.rooms?.toList()
    }

    suspend fun changePassword(
        userId: Int,
        newPasswordHash: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getUserById(userId)?.apply {
            passwordHash = newPasswordHash
        }
    }

    suspend fun changeUserData(
        userId: Int,
        newDisplayName: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getUserById(userId)?.apply {
            displayName = newDisplayName
        }
    }

    suspend fun getUserInvites(
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getUserById(userId)?.run {
            invites.toList()
        }
    }

    suspend fun declineInvite(
        userId: Int,
        inviteId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getUserById(userId)?.run {
            invites.find {
                it.id.value == inviteId
            }?.let {
                invites = SizedCollection(invites.filter { it.id.value != inviteId })
                inviteId
            }
        }
    }
}