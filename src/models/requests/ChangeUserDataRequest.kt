package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class ChangeUserDataRequest(
    @SerializedName("new_display_name") val newDisplayName: String
) {
    companion object {
        val example = mapOf(
            "new_display_name" to "Michael Jackson"
        )
    }
}