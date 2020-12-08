package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName

data class RoomsResponse(
    @SerializedName("rooms") val rooms: List<RoomResponse>
) {
    companion object {
        val example = mapOf(
            "rooms" to listOf(RoomResponse.example, RoomResponse.example, RoomResponse.example)
        )
    }
}