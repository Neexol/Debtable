package ru.neexol.debtable.repositories

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import ru.neexol.debtable.db.entities.Room
import ru.neexol.debtable.db.entities.User
import ru.neexol.debtable.utils.exceptions.ForbiddenException
import ru.neexol.debtable.utils.exceptions.NotFoundException
import ru.neexol.debtable.utils.ifFalse

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
            it.members = SizedCollection(it.members + user)
        }
    }

    suspend fun isRoomContainsUser(
        roomId: Int,
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.members?.find { it.id.value == userId } != null
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
            delete()
        }?.id?.value
    }

    suspend fun getRoomMembers(
        roomId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.members?.toList()
    }

    suspend fun deleteMemberFromRoom(
        roomId: Int,
        memberId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.run {
            members.find {
                it.id.value == memberId
            }?.also {
                members = SizedCollection(members.filter { it.id.value != memberId })
                members.toList().ifEmpty { deleteRoom(roomId) }
            }?.id?.value
        }
    }

    suspend fun checkRoomAccess(
        roomId: Int,
        userId: Int
    ) = getRoomById(roomId)?.also {
        isRoomContainsUser(roomId, userId).ifFalse { throw ForbiddenException() }
    } ?: throw NotFoundException()

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

    suspend fun acceptInvite(
        inviteId: Int,
        user: User
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(inviteId)?.run {
            invitedUsers.find {
                it.id.value == user.id.value
            }?.let {
                invitedUsers = SizedCollection(invitedUsers.filter { it.id.value != user.id.value })
                members = SizedCollection(members + user)
                this
            }
        }
    }

    suspend fun deleteInvite(
        roomId: Int,
        userId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.run {
            invitedUsers.find {
                it.id.value == userId
            }?.let {
                invitedUsers = SizedCollection(invitedUsers.filter { it.id.value != userId })
                userId
            }
        }
    }

    suspend fun getRoomPurchases(
        roomId: Int
    ) = newSuspendedTransaction(Dispatchers.IO) {
        getRoomById(roomId)?.purchases?.toList()
    }
}