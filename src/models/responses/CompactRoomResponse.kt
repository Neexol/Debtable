package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import ru.neexol.debtable.db.entities.Room

data class CompactRoomResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String
) {
    constructor(room: Room): this(
        room.id.value,
        room.name
    )

    companion object {
        val example = mapOf(
            "id" to 5,
            "name" to "Other room"
        )
    }
}