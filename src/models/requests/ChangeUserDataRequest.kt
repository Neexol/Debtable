package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class ChangeUserDataRequest(
    @SerializedName("display_name") val displayName: String
)