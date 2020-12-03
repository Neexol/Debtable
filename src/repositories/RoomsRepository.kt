package ru.neexol.debtable.repositories

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.Room
import ru.neexol.debtable.db.entities.User

object RoomsRepository {
    suspend fun addRoom(
        name: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        Room.new {
            this.name = name
        }
    }

    suspend fun getRoomById(
        roomId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        Room.findById(roomId)
    }

    suspend fun addUserToRoom(
        roomId: Int,
        user: User
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.let {
            it.users = SizedCollection(it.users + user)
        }
    }
}