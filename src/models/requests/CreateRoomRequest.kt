package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class CreateRoomRequest(
    @SerializedName("name") val name: String
) {
    companion object {
        val example = mapOf(
            "name" to "My room"
        )
    }
}