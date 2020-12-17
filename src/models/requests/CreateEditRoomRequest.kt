package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class CreateEditRoomRequest(
    @SerializedName("name") val name: String
) {
    companion object {
        val EXAMPLE = mapOf(
            "name" to "My room"
        )
    }
}