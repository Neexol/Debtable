package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class EditRoomRequest(
    @SerializedName("new_name") val newName: String
) {
    companion object {
        val example = mapOf(
            "new_name" to "New room name"
        )
    }
}