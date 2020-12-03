package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class RegisterUserRequest(
    @SerializedName("username") val username: String,
    @SerializedName("display_name") val displayName: String,
    @SerializedName("password") val password: String
) {
    companion object {
        val example = mapOf(
            "username" to "neexol",
            "display_name" to "Nikita Alexeev",
            "password" to "SuperPass123"
        )
    }
}