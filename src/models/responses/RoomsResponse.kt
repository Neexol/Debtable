package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Room

data class RoomsResponse(
    @SerializedName("rooms") val rooms: List<CompactRoomResponse>
) {
    companion object {
        val example = mapOf(
            "rooms" to listOf(CompactRoomResponse.example, CompactRoomResponse.example, CompactRoomResponse.example)
        )
    }
}