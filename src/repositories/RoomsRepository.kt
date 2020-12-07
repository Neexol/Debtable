package ru.neexol.debtable.repositories

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.Room
import ru.neexol.debtable.db.entities.User
import ru.neexol.debtable.utils.exceptions.ForbiddenException
import ru.neexol.debtable.utils.exceptions.NotFoundException
import ru.neexol.debtable.utils.ifFalse
import ru.neexol.debtable.utils.ifTrue

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

    suspend fun isRoomContainsUser(
        roomId: Int,
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.users?.find { it.id.value == userId } != null
    }

    suspend fun editRoom(
        roomId: Int,
        newName: String
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.apply {
            name = newName
        }
    }

    suspend fun deleteRoom(
        roomId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.apply {
            users = SizedCollection()
            delete()
        }?.id?.value
    }

    suspend fun deleteMemberFromRoom(
        roomId: Int,
        memberId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.run {
            users.find {
                it.id.value == memberId
            }?.also { user ->
                users = SizedCollection(users - user)
                users.toList().ifEmpty { delete() }
            }?.id?.value
        }
    }

    suspend fun inviteUserToRoom(
        roomId: Int,
        user: User
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.run {
            invitedUsers.find {
                it.id.value == user.id.value
            }?.let {
                return@run null
            } ?: user.also {
                invitedUsers = SizedCollection(invitedUsers + user)
            }
        }
    }

    suspend fun getInvitedUsersToRoom(
        roomId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.invitedUsers?.toList()
    }

    suspend fun checkRoomAccess(
        roomId: Int,
        userId: Int
    ): Room {
        val room = getRoomById(roomId) ?: throw NotFoundException()
        isRoomContainsUser(roomId, userId).ifFalse { throw ForbiddenException() }
        return room
    }
}