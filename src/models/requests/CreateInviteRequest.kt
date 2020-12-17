package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class CreateInviteRequest(
    @SerializedName("user_id") val userId: Int
) {
    companion object {
        val EXAMPLE = mapOf(
            "user_id" to 3
        )
    }
}