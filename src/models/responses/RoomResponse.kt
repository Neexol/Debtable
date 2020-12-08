package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Room

data class RoomResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("members_number") val membersNumber: Int
) {
    constructor(room: Room): this(
        room.id.value,
        room.name,
        transaction { room.members.count().toInt() }
    )

    companion object {
        val EXAMPLES = listOf(
            mapOf(
                "id" to 1,
                "name" to "Admin room",
                "members_number" to 3
            ),
            mapOf(
                "id" to 2,
                "name" to "1206 room",
                "members_number" to 4
            ),
            mapOf(
                "id" to 3,
                "name" to "Printer room",
                "members_number" to 5
            )
        )
    }
}