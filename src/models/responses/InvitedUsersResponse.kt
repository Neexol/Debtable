package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName

data class InvitedUsersResponse(
    @SerializedName("invited_users") val invitedUsers: List<UserResponse>
) {
    companion object {
        val example = mapOf(
            "invited_users" to listOf(UserResponse.example, UserResponse.example, UserResponse.example)
        )
    }
}