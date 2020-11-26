package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class LoginUserRequest(
    @SerializedName("username") val username: String,
    @SerializedName("password") val password: String
)