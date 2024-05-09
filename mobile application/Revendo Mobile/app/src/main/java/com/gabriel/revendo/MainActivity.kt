package com.gabriel.revendo

import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberImagePainter
import com.gabriel.revendo.ui.theme.RevendoTheme
import kotlinx.coroutines.delay
import okhttp3.OkHttpClient
import okhttp3.internal.wait
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

data class HistoryItem(
    val id: Int,
    val rfid_number: String,
    val height: Int,
    val weight: Int,
    val size: String,
    val captured_image: String,
    val is_valid: String,
    val date: String
)

// Update the API service to use the new HistoryItem class and adjust the GET history endpoint
interface RFIDApiService {
    @POST("/check_balance")
    @FormUrlEncoded
    fun checkBalance(@Field("rfid") rfid: String): Call<Int>

    @GET("/api/history")
    fun getHistory(@Query("rfid_number") rfid: String): Call<List<HistoryItem>>
}


class MainActivity : ComponentActivity() {
    private var searchText by mutableStateOf("")
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://revendo-backend-main.onrender.com")
        .client(
            OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
                .build()
        )
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val apiService = retrofit.create(RFIDApiService::class.java)

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RevendoTheme {
                // Use remember to ensure that the splash screen is shown only once
                val showSplashScreen = remember { mutableStateOf(true) }
                // Use remember to store whether data has been fetched or not
                val dataFetched = remember { mutableStateOf(false) }


                if (showSplashScreen.value) {
                    SplashScreen {
                        // onAnimationComplete callback to remove splash screen
                        showSplashScreen.value = false
                    }
                } else {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color.Black
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize()
                        ) {
                            // Header
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp)
                                    .background(color = Color.Black),
                                shadowElevation = 4.dp
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .background(color = Color(0xFF7289DA))
                                        .padding(8.dp)
                                ) {
                                    Image(
                                        painter = painterResource(id = R.drawable.wlogo),
                                        contentDescription = "Logo",
                                        modifier = Modifier.size(42.dp)
                                    )
                                    Text(
                                        text = "Revendo",
                                        color = Color.White,
                                        modifier = Modifier.padding(start = 12.dp)
                                    )
                                }
                            }

                            // Content
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .weight(1f)
                            ) {
                                RFIDBalanceScreen(apiService = apiService, searchText = searchText) {
                                    // onDataFetched callback to set dataFetched to true
                                    dataFetched.value = true
                                }
                            }

                            // Footer
                            AnimatedVisibility(
                                visible = dataFetched.value, // Hide footer if data is not fetched
                                enter = fadeIn(),
                                exit = fadeOut()
                            ) {
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(color = Color.Black)
                                        .animateContentSize(), // Allow the height to animate when changed
                                    shadowElevation = 4.dp
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier
                                            .background(color = Color(0xFF7289DA))
                                    ) {
                                        TextField(
                                            value = searchText,
                                            onValueChange = { searchText = it },
                                            label = {
                                                Text(
                                                    "Filter by DATE/SIZE",
                                                    color = Color(0xFF7289DA)
                                                )
                                            },
                                            placeholder = {
                                                Text(
                                                    text = "e.g - 2024 , 03 , small",
                                                    color = Color.Gray // Color of the placeholder text
                                                )
                                            },
                                            shape = RoundedCornerShape(8.dp),
                                            textStyle = TextStyle(
                                                color = Color.Black,
                                                fontSize = 18.sp
                                            ), // Adjust text size here
                                            colors = TextFieldDefaults.colors(
                                                focusedIndicatorColor = Color(0xFF7289DA), // Indicator color when focused
                                                unfocusedIndicatorColor = Color(0xFF7289DA), // Indicator color when not focused
                                                cursorColor = Color.White,
                                                unfocusedContainerColor = Color.White,
                                                focusedContainerColor = Color.White
                                            ),
                                            modifier = Modifier
                                                .padding(horizontal = 16.dp, vertical = 12.dp)
                                                .fillMaxWidth()
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RFIDBalanceScreen(apiService: RFIDApiService, searchText: String, onDataFetched: () -> Unit) {
    var rfid by remember { mutableStateOf(TextFieldValue()) }
    var balance by remember { mutableIntStateOf(0) }
    var history by remember { mutableStateOf<List<HistoryItem>>(emptyList()) }
    var errorMessage by remember { mutableStateOf("") }
    var expandedIndex by remember { mutableIntStateOf(-1) }
    var isFetchButtonClicked by remember { mutableStateOf(false) } // Track if Fetch Data button is clicked
    var isInputEmpty by remember { mutableStateOf(true) } // Track if RFID input is empty
    var isLoading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // TextField for entering RFID number
            val containerColor = Color(0xFF5865F2)
            TextField(
                value = rfid,
                onValueChange = {
                    rfid = it
                    isInputEmpty = it.text.isEmpty()
                },
                label = { Text("RFID Number", color = Color.White) },
                shape = RoundedCornerShape(8.dp),
                textStyle = TextStyle(color = Color.White),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = containerColor,
                    unfocusedContainerColor = containerColor,
                    disabledContainerColor = containerColor,
                    cursorColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                ),
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 16.dp)
                    .widthIn(max = 200.dp) // Set max width for the text field
            )

            Spacer(modifier = Modifier.width(8.dp)) // Add space between text field and button

            // Button to fetch data
            Button(
                onClick = {
                    isLoading = true
                    isFetchButtonClicked = true
                    // Fetch balance
                    apiService.checkBalance(rfid.text).enqueue(object : Callback<Int> {
                        override fun onResponse(call: Call<Int>, response: Response<Int>) {
                            isLoading = false
                            if (response.isSuccessful) {
                                onDataFetched()
                                balance = response.body() ?: 0
                                errorMessage = ""
                                // Fetch history if balance is found
                                if (balance >= 0) {
                                    apiService.getHistory(rfid.text)
                                        .enqueue(object : Callback<List<HistoryItem>> {
                                            override fun onResponse(
                                                call: Call<List<HistoryItem>>,
                                                response: Response<List<HistoryItem>>
                                            ) {
                                                if (response.isSuccessful) {
                                                    history = response.body()?.filter {
                                                        it.rfid_number == rfid.text &&
                                                                it.is_valid == "yes" &&
                                                                it.size in listOf(
                                                            "Small",
                                                            "Medium",
                                                            "Large"
                                                        )
                                                    } ?: emptyList()
                                                    errorMessage = ""
                                                } else {
                                                    errorMessage = "Failed to fetch history"
                                                }
                                            }

                                            override fun onFailure(
                                                call: Call<List<HistoryItem>>,
                                                t: Throwable
                                            ) {
                                                isLoading = false
                                                errorMessage =
                                                    "Failed to connect to server: ${t.message}"
                                            }
                                        })
                                }
                            } else {
                                errorMessage = "RFID not found"
                                // Clear history if RFID is not found
                                history = emptyList()
                            }
                        }

                        override fun onFailure(call: Call<Int>, t: Throwable) {
                            errorMessage = "Failed to connect to server: ${t.message}"
                        }
                    })
                },
                enabled = true, // Always enabled
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .padding(vertical = 16.dp, horizontal = 8.dp),
                colors = ButtonDefaults.buttonColors
                    (
                    containerColor = Color(0xFF5865F2),
                    contentColor = Color.White
                )
            ) {
                Text("Fetch Data", color = Color.White)
            }


        }

        Spacer(modifier = Modifier.height(16.dp))
        if (isLoading) {
            CircularProgressIndicator(color = Color.White)
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = if (isInputEmpty) Arrangement.Center else Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (!isInputEmpty && isFetchButtonClicked) {
                Text(
                    text = "Number of Entries: ${history.size}",
                    color = Color.White,
                    modifier = Modifier.padding(8.dp)
                )
                Text(
                    text = "Current Balance: $balance",
                    color = Color.White,
                    modifier = Modifier.padding(8.dp)
                )
            }
            if (isInputEmpty) {
                Text(
                    text = "Please Input RFID",
                    color = Color.Yellow,
                    modifier = Modifier.padding(8.dp)
                )
            }
        }


        // Display error message if any
        if (errorMessage.isNotEmpty()) {
            Text(
                text = errorMessage,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                textAlign = TextAlign.Center,
                color = Color.Red
            )
        }

        // Display history
        if (history.isNotEmpty()) {
            val filteredHistory = history.filter { item ->
                item.date.contains(searchText, ignoreCase = true) ||
                        item.size.contains(searchText, ignoreCase = true)
            }

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
            ) {
                itemsIndexed(filteredHistory) { index, item ->
                    HistoryItemRow(
                        historyItem = item,
                        index = index,
                        expandedIndex = expandedIndex,
                        onExpandItem = { expandedIndex = it }
                    )
                }
                item {
                    Text(
                        text = "End of List",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        color = Color.White,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

    }
}


@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun HistoryItemRow(
    historyItem: HistoryItem,
    index: Int,
    expandedIndex: Int,
    onExpandItem: (Int) -> Unit
) {
    // Trim the date string to remove the time and 'z'
    var isExpanded = index == expandedIndex
    val trimmedDate = historyItem.date.substringBefore('T')
    // Extract the time from the trimmed date
    val time = historyItem.date.substringAfter('T', "").substringBefore('.', "")

    // Parse the date and time string to Instant
    val instant = Instant.parse(historyItem.date)
    // Convert to LocalDateTime in UTC timezone
    val localDateTime = instant.atZone(ZoneId.of("UTC")).toLocalDateTime()
    // Format the time in 12-hour format with AM/PM
    val formattedTime = localDateTime.format(DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH))

    // Extract the size name from the provided string
    val sizeName = historyItem.size.substringAfter(':').capitalize()

    // Convert base64 string to ByteArray
    val imageByteArray =
        android.util.Base64.decode(historyItem.captured_image, android.util.Base64.DEFAULT)

    // Create bitmap from ByteArray
    val bitmap = BitmapFactory.decodeByteArray(imageByteArray, 0, imageByteArray.size)

    // Create painter from bitmap
    val painter = rememberImagePainter(data = bitmap)

    Column(
        modifier = Modifier
            .padding(8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    if (isExpanded) {
                        onExpandItem(-1) // Collapse if already expanded
                    } else {
                        onExpandItem(index) // Expand if not already expanded
                    }
                }
                .drawBehind {
                    drawLine(
                        color = Color(0xFF5865F2),
                        start = Offset(0f, 0f),
                        end = Offset(size.width, 0f),
                        strokeWidth = 2.dp.toPx()
                    )
                    drawLine(
                        color = Color(0xFF5865F2),
                        start = Offset(0f, size.height),
                        end = Offset(size.width, size.height),
                        strokeWidth = 2.dp.toPx()
                    )
                }
                .padding(vertical = 12.dp, horizontal = 8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Icon indicating expand/collapse state
                Icon(
                    imageVector = if (isExpanded) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowRight,
                    contentDescription = "Expand/Collapse",
                    tint = Color(0xFF5865F2),
                    modifier = Modifier.size(24.dp) // Set the size of the icon
                )
                Spacer(modifier = Modifier.width(8.dp))

                // Title for date and time
                Text(
                    text = "DATE/TIME: ",
                    color = Color(0xFF5865F2), // Header text color
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp // Set the font size of the text
                )

                // Display date and time
                Text(
                    text = "$trimmedDate / $formattedTime",
                    color = Color.White,
                    modifier = Modifier.weight(1f),
                    fontSize = 18.sp // Set the font size of the text
                )
            }
        }
        // Display additional details in expanded state
        AnimatedVisibility(visible = isExpanded) {
            Column {
                Spacer(modifier = Modifier.height(8.dp))

                // Size and Points details in horizontal row
                Row(
                    modifier = Modifier.padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = "Size: ",
                            color = Color(0xFF5865F2),
                            fontSize = 24.sp,
                            textAlign = TextAlign.End,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Text(
                            text = "Points: ",
                            color = Color(0xFF5865F2),
                            fontSize = 24.sp,
                            textAlign = TextAlign.End
                        )
                    }
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = sizeName,
                            color = Color.White,
                            fontSize = 20.sp,
                            textAlign = TextAlign.Start,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Text(
                            text = "${
                                when (historyItem.size.lowercase(Locale.ROOT)) {
                                    "small" -> 1
                                    "medium" -> 2
                                    "large" -> 3
                                    else -> 0
                                }
                            }",
                            color = Color.White,
                            fontSize = 20.sp,
                            textAlign = TextAlign.Start
                        )
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    // Display captured image with border and title
                    Column(
                        modifier = Modifier
                            .border(width = 2.dp, color = Color(0xFF5865F2))
                            .padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally // Center align the content
                    ) {
                        Text(
                            text = "Captured Image",
                            color = Color(0xFF5865F2),
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Image(
                            painter = painter,
                            contentDescription = null,
                            modifier = Modifier
                                .size(150.dp) // Set the size of the image
                                .padding(8.dp),
                            contentScale = ContentScale.FillWidth
                        )
                    }
                }

            }
        }
    }
}

@Composable
fun SplashScreen(onAnimationComplete: () -> Unit) {
    // Create an Animatable for animating the opacity
    val alpha = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        // Animate the opacity from 0f to 1f over 1 second
        alpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 1000)
        )
        // Wait for a short duration before calling onAnimationComplete
        delay(1500)
        onAnimationComplete()
    }

    // Surface with content to display on splash screen
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(color = Color.Black),
        contentAlignment = Alignment.Center
    ) {
        // Add your logo and text
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(id = R.drawable.rlogo),
                contentDescription = "Logo",
                modifier = Modifier
                    .size(250.dp)
                    .alpha(alpha.value)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "REVENDO",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 64.sp,
                modifier = Modifier.alpha(alpha.value)
            )
        }
    }

}
