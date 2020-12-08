package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class AcceptInviteRequest(
    @SerializedName("invite_id") val inviteId: Int
) {
    companion object {
        val EXAMPLE = mapOf(
            "invite_id" to 3
        )
    }
}