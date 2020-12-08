package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class ChangePasswordRequest(
    @SerializedName("old_password") val oldPassword: String,
    @SerializedName("new_password") val newPassword: String
) {
    companion object {
        val EXAMPLE = mapOf(
            "old_password" to "OldEasyPass",
            "new_password" to "NewSuperPass123"
        )
    }
}