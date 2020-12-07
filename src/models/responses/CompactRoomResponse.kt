package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Room

data class CompactRoomResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("members_number") val membersNumber: Int
) {
    constructor(room: Room): this(
        room.id.value,
        room.name,
        transaction { room.users.count().toInt() }
    )

    companion object {
        val example = mapOf(
            "id" to 5,
            "name" to "Other room"
        )
    }
}